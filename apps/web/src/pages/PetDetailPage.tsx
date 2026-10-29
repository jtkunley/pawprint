import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ApiError } from '../api/client';
import { usePet, useSubmitApplication } from '../api/hooks';
import { AdoptionForm } from '../components/AdoptionForm';
import { ApplicationConfirmation } from '../components/ApplicationConfirmation';
import { PetDetails, PetDetailsSkeleton } from '../components/PetDetails';
import { StateMessage } from '../components/StateMessage';

export function PetDetailPage() {
  const { petId = '' } = useParams();
  // Keyed so that form and submission state never leak between pets.
  return <PetDetailContent key={petId} petId={petId} />;
}

function PetDetailContent({ petId }: { petId: string }) {
  const pet = usePet(petId);
  const submission = useSubmitApplication();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const backLink = (
    <Link to="/" className="back-link">
      ← Back to all pets
    </Link>
  );

  if (pet.isPending) {
    return (
      <>
        {backLink}
        <PetDetailsSkeleton />
      </>
    );
  }

  if (!pet.data) {
    const notFound = pet.error instanceof ApiError && pet.error.status === 404;
    return (
      <>
        {backLink}
        <StateMessage
          tone="error"
          headingLevel="h1"
          title={notFound ? 'We couldn’t find that pet' : 'We couldn’t load this pet'}
          action={
            notFound ? (
              <Link to="/" className="button button--primary">
                Browse all pets
              </Link>
            ) : (
              <button
                type="button"
                className="button button--primary"
                onClick={() => pet.refetch()}
              >
                Try again
              </button>
            )
          }
        >
          <p>
            {notFound
              ? 'They may have been removed from the catalog, or the link might be wrong.'
              : 'Something went wrong while talking to the server. Please try again.'}
          </p>
        </StateMessage>
      </>
    );
  }

  let aside;
  if (submission.isSuccess) {
    aside = <ApplicationConfirmation application={submission.data} />;
  } else if (pet.data.status === 'adopted') {
    aside = (
      <StateMessage title={`${pet.data.name} has found a home`}>
        <p>
          This pet has already been adopted. There are plenty of other friends waiting to meet you!
        </p>
      </StateMessage>
    );
  } else {
    aside = (
      <AdoptionForm
        pet={pet.data}
        onSubmit={(application) => submission.mutate(application)}
        isSubmitting={submission.isPending}
        error={submission.error}
      />
    );
  }

  return (
    <>
      <title>{`${pet.data.name} · Pawprint`}</title>
      {backLink}
      <div className="detail-layout">
        <PetDetails pet={pet.data} />
        <div className="detail-layout__aside">{aside}</div>
      </div>
    </>
  );
}
